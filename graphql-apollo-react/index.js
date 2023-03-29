import {ApolloServer, gql} from 'apollo-server';
import {
  employees as employeeCollection,
  employers as employerCollection
} from './config/mongoCollections.js';

import {v4 as uuid} from 'uuid'; //for generating _id's

//Create the type definitions for the query and our data
const typeDefs = gql`
  type Query {
    employers: [Employer]
    employees: [Employee]
    employer(_id: Int): Employer
    employee(_id: String): Employee
  }

  type Employer {
    _id: Int
    name: String
    employees: [Employee]
    numOfEmployees: Int
  }

  type Employee {
    _id: String
    firstName: String
    lastName: String
    employer: Employer
  }

  type Mutation {
    addEmployee(
      firstName: String!
      lastName: String!
      employerId: Int!
    ): Employee
    removeEmployee(_id: String!): Employee
    editEmployee(
      _id: String!
      firstName: String
      lastName: String
      employerId: Int
    ): Employee
    addEmployer(name: String!): Employer
  }
`;

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

const resolvers = {
  Query: {
    employer: async (_, args) => {
      const employers = await employerCollection();
      const employer = await employers.findOne({_id: args._id});
      return employer;
    },
    employee: async (_, args) => {
      const employees = await employeeCollection();
      const employee = await employees.findOne({_id: args._id});
      return employee;
    },
    employers: async () => {
      const employers = await employerCollection();
      const allEmployers = await employers.find({}).toArray();
      return allEmployers;
    },
    employees: async () => {
      const employees = await employeeCollection();
      const allEmployees = await employees.find({}).toArray();
      return allEmployees;
    }
  },
  Employer: {
    numOfEmployees: async (parentValue) => {
      console.log(`parentValue in Employer`, parentValue);
      const employees = await employeeCollection();
      const numOfEmployees = await employees.count({
        employerId: parentValue._id
      });
      return numOfEmployees;
    },
    employees: async (parentValue) => {
      const employees = await employeeCollection();
      const employs = await employees
        .find({employerId: parentValue._id})
        .toArray();
      return employs;
    }
  },
  Employee: {
    employer: async (parentValue) => {
      //console.log(`parentValue in Employee`, parentValue);
      const employers = await employerCollection();
      const employer = await employers.findOne({_id: parentValue.employerId});
      return employer;
    }
  },
  Mutation: {
    addEmployee: async (_, args) => {
      const employees = await employeeCollection();

      const newEmployee = {
        _id: uuid(),
        firstName: args.firstName,
        lastName: args.lastName,
        employerId: args.employerId
      };
      await employees.insertOne(newEmployee);
      return newEmployee;
    },
    removeEmployee: async (_, args) => {
      const employees = await employeeCollection();
      const oldEmployee = await employees.findOne({_id: args._id});
      const deletionInfo = await employees.deleteOne({_id: args._id});
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with _id of ${args._id}`;
      }
      return oldEmployee;
    },
    editEmployee: async (_, args) => {
      const employees = await employeeCollection();
      let newEmployee = await employees.findOne({_id: args._id});
      if (newEmployee) {
        if (args.firstName) {
          newEmployee.firstName = args.firstName;
        }
        if (args.lastName) {
          newEmployee.lastName = args.lastName;
        }
        if (args.employerId && args.employerId > 0) {
          const employers = await employerCollection();
          const employerCount = await employers.count({});
          if (employerCount + 1 >= args.employerId) {
            newEmployee.employerId = args.employerId;
          }
        }
        await employees.updateOne({_id: args._id}, {$set: newEmployee});
      }
      return newEmployee;
    },
    addEmployer: async (_, args) => {
      const employers = await employerCollection();
      const employerCount = await employers.count({});
      const newEmployer = {
        _id: employerCount + 1,
        name: args.name
      };
      await employers.insertOne(newEmployer);
      return newEmployer;
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
