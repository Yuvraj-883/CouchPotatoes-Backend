import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    plot: String!
    genres: [String]
    runtime: Int
    cast: [String]
    numMflixComments: Int
    poster: String
    fullplot: String
    languages: [String]
    released: String
    directors: [String]
    writers: [String]
    awards: Award
    lastUpdated: String
    year: Int
    imdb: IMDB
    countries: [String]
    type: String
    tomatoes: TomatoRatings
    likes: Int
    likedBy: [ID]
  }

  type Award {
    wins: Int
    nominations: Int
    text: String
  }

  type IMDB {
    rating: Float
    votes: Int
    id: Int
  }

  type TomatoRatings {
    viewer: Viewer
    lastUpdated: String
  }

  type Viewer {
    rating: Float
    numReviews: Int
    meter: Int
  }

  type genre{
  genre: String
  }
  
  type moviesResponse{
  movies: [Movie],
  totalPages: Int,
  currentPage: Int,
    
  }
  type Query {
    movies(pageNumber: Int, pageSize: Int, genres: [String]): moviesResponse
    movie(id: ID!): Movie
    getGenres: [String]
  }

 
`;



export default typeDefs;
