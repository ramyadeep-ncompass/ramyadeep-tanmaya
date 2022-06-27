import React, { useEffect, useState } from "react";

function FetchRepo(props) {

  const token = props.token;

  const [userRepo, setUserRepo] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {

    async function test() {
      const response = await fetch("http://52.65.9.30:5002/user/repositories", { headers: { "Authorization": "Bearer " + token } })
      const result = await response.json();
      setUserRepo(result.repositories)
      setStatus(true);


    }
    test();
  }, [token]);

  if (!status)
    return <h2> Loading.... </h2>;

  return (
    <div>
      <table id="table1">
     <thead>
     <tr>
          <th>id</th>
          <th>repositoryOwner</th>
          <th>email</th>
          <th>repositoryId</th>
          <th>repositoryName</th>
          <th>repositoryUrl</th>
          <th>cloneUrl</th>
          <th>contributorsUrl</th>
        </tr>
     </thead>
        <tbody>
        {
          userRepo.map(data => {
            
            return <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.repositoryOwner}</td>
              <td>{data.email}</td>
              <td>{data.repositoryId}</td>
              <td>{data.repositoryName}</td>
              <td>{data.repositoryUrl}</td>
              <td>{data.cloneUrl}</td>
              <td>{data.contributorsUrl}</td>
            </tr>
          })
        }
        </tbody>
      </table>
    </div>
  );
}
export default FetchRepo;