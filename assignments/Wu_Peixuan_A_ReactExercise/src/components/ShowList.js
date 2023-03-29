import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { useParams } from "react-router-dom"; // get the pageNum
import { useNavigate } from "react-router-dom"; // change the client-side url

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

import '../App.css';

const ShowList = () => {
  const { pageNum } = useParams();

 

  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined); // shows data
  const [page, setPage] = useState(Number(pageNum) || 0); // track the current page
  const [searchTerm, setSearchTerm] = useState('');
  let card = null;

  // create the button component
  const SetPageButton = ({page, setPage}) => {

    const [isLast, setLast] = useState(true);
    const [isValid, setValid] = useState(false);
    const navigate = useNavigate();
    // add next page and previous page function
    const goNextPage = () => {
      setPage(page + 1);
      navigate(`/shows/page/${page + 1}`);
    }

    const goPreviousPage = () => {
      setPage(page - 1);
      navigate(`/shows/page/${page - 1}`);;
    }
    

    // function to determine whether current page is the first page or the last page
    useEffect(() => {
      async function fetchData() {
        try {
          const response = await axios.get(`http://api.tvmaze.com/shows?page=${page}`);
          if (response.data.length > 0) {
            setValid(true);
          }
          else {
            setValid(false);
          }
        } catch (error) {
          console.log(error);
        }
  
        try {
          const response = await axios.get(`http://api.tvmaze.com/shows?page=${page + 1}`);
          if (response.data.length > 0) {
            setLast(false);
          }
          else {
            setLast(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
      
      fetchData();
    }, [page]);
    
    const isFirstPage = page === 0;


    return (
      <div className='pagination'>
        {isValid && !isFirstPage && (
          <button className='btn' onClick={goPreviousPage}>
            Previous Page
          </button>
        )}
        {isValid && !isLast && (
          <button className='btn' onClick={goNextPage}>
            Next Page
          </button>
        )}
      </div>
    )

    
    }
  

  useEffect(() => {
    console.log('on load useEffect');
    async function fetchData() {
      try {
        const {data} = await axios.get(`http://api.tvmaze.com/shows?page=${page}`);
        setShowsData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [page]); // we rerender this component whenever the page variable change

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const {data} = await axios.get(
          'http://api.tvmaze.com/search/shows?q=' + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    } 
    
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={show.id}>
        <Card
          variant='outlined'
          sx={{
            maxWidth: 250,
            height: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: 5,
            border: '1px solid #1e8678',
            boxShadow:
              '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
          }}
        >
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                sx={{
                  height: '100%',
                  width: '100%'
                }}
                component='img'
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title='show image'
              />

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: '1px solid #1e8678',
                    fontWeight: 'bold'
                  }}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {show.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {show.summary
                    ? show.summary.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let {show} = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }
  // check the params is a number
  if (isNaN(pageNum)) {
    return (
      <div>
        Please Input Valid Page Number!
      </div>
    )
  }
    
  // show Not Found if the page out of range.
  if (Number(pageNum) < 0 || Number(pageNum) > 269) {
  return (
    <div>
      Not Found! You are out of page range!
    </div>
    )
  }
  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchShows searchValue={searchValue} />
        <br />
        <br />
        <SetPageButton page={page} setPage={setPage}/>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row'
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
};

export default ShowList;
