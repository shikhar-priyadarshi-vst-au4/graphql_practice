const {ApolloServer, gql} = require("apollo-server");
const {GraphQLScalarType, Kind} = require("graphql");

// A schema is collection of type definitons that together define the shape of queries that 
// are executed against your data

const typeDefs = gql`
 scalar Date
 scalar Odd
type Book{
    title : String
    author : String
    date : Date
    odd : Odd
}

# query type is special it list down all of the available queries that client can execute, 
# along with return type for each
type Query{
    books : [Book!]
}
`;

const dateScalar = new GraphQLScalarType({
    name : "date",
    description : "Custom Date Type",
    serialize(value){
        return value.toGMTString();
    },
    parseValue(value){
        return new Date(value)
    },
    parseLiteral(ast){
        if(ast.kind === Kind.INT){
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    }
})

const oddFn = (v) => v%2 === 1 ? v : null;

const oddScalar = new GraphQLScalarType({
    name : "odd",
    description : "return either odd values or null",
    serialize(value){
        return oddFn(parseInt(value));
    },
    parseValue(value){
        return oddFn(value)
    },
    parseLiteral(ast){
        return ast.kind === Kind.INT ? oddFn(parseInt(ast.value, 10)) : null;
    }
})


const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
      date : new Date(),
      odd : 3
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
      date : new Date(),
      odd : 2
    },
  ];


  const resolvers = {
      Date : dateScalar,
      Odd : oddScalar,
      Query : {
          books : () => books,
      }
  }


  const server = new ApolloServer({
      typeDefs,
      resolvers
  })

  server.listen().then(({url}) => {
      console.log(`Server listen at ${url}`);
  })