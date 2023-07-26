import React, { useState } from 'react'
import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';

const GET_USERS = gql`
  query getusers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

const GET_ALL_MOVIES = gql`
  query getmovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_SINGLE_MOVIES = gql`
  query GetSinglemovie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
    }
  }
`;

export default function DisplayData() {

  const [searchedMovie, setSearchedMovie] = useState('')

  const [addName, setAddName] = useState('')
  const [addAge, setAddAge] = useState('')
  const [addUsername, setAddUsername] = useState('')
  const [addNationality, setAddNationality] = useState('')

  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const { data: allMovies } = useQuery(GET_ALL_MOVIES);
  const [
    fetchMovieData,
    { data: searchedMovieData, error: searchedMovieError }
  ] = useLazyQuery(GET_SINGLE_MOVIES)

  const [
    createUser,
    { data: newUserData, error: newUserError }
  ] = useMutation(CREATE_USER)

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error : {error.message}</p>;

  const { users } = data;
  // const { movies } = allMovies ?? {};

  if (newUserError) {
    console.log("newUserError", newUserError);
  }

  return (
    <div>
      <div>
        <div>
          <h3>Create User</h3>
        </div>
        <form>
          <label>Name</label>
          <input type='text' placeholder='Name' onChange={(e) => setAddName(e.target.value)} /><br />
          <label>Age</label>
          <input type='number' placeholder='Age(must be a number)' onChange={(e) => setAddAge(e.target.value)} /><br />
          <label>Username</label>
          <input type='text' placeholder='Username' onChange={(e) => setAddUsername(e.target.value)} /><br />
          <label>Nationality</label>
          <input type='text' placeholder='Nationality' onChange={(e) => setAddNationality(e.target.value.toUpperCase())} /><br />
          <button
            type='button'
            onClick={() => {
              createUser({
                variables: {
                  input: {
                    name: addName,
                    age: Number(addAge),
                    username: addUsername,
                    nationality: addNationality
                  }
                }
              })
              refetch()
            }}
          >Submit</button>
        </form>
      </div>

      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Username</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.username}</td>
                  <td>{user.nationality.toLowerCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
        <br></br>
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Id</th>
                <th>Theather</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {allMovies?.movies?.map((movie, index) => (
                <tr key={index}>
                  <td>{movie?.name}</td>
                  <td>{movie?.id}</td>
                  <td>{movie?.isInTheaters ? <span>Yes</span> : <span>No</span>}</td>
                  <td>{movie?.yearOfPublication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3>Search Movie List</h3>
        <input
          placeholder='search movie'
          type='text'
          style={{ padding: "20px" }}
          onChange={(e) => setSearchedMovie(e.target.value)}
        />
        <br></br>
        <button onClick={() => {
          fetchMovieData({
            variables: {
              name: searchedMovie
            }
          })
        }}>Search</button>
      </div>
      <div>
        {searchedMovieData ? (
          <div>
            {" "}
            <h2>Movie Name: {searchedMovieData.movie.name}</h2>
            <h2>Movie Name: {searchedMovieData.movie.yearOfPublication}</h2>
          </div>
        ) : null}
        <div>
          {searchedMovieError && <h4 style={{ color: "red" }}>Error fetching data: Cannot return null for non-nullable field Query.movie.</h4>}
        </div>
      </div>
    </div>
  )
}
