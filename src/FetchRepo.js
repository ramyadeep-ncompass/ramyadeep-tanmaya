import React, { useEffect, useState } from "react";

function FetchRepo(props) {

  const token = props.token;

  const [userDetails, setUserDetails] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {

    async function test() {
      const response = await fetch("http://localhost:3001/user/repositories", { headers: { "Authorization": "Bearer " + token } })
      const result = await response.json();

      console.log(result)
    }
    test();
  }, [token]);

  if (!status)
    return <h2> Loading.... </h2>;

  return (
    <div>
      <table id="table1">
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
      </table>

      {
        userDetails.data.map((data) => (
          <table key={data.S_ID}>
            <tr>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.contributors}</td>
            </tr>

          </table>
        ))
      }
    </div>
  );
}
export default FetchRepo;