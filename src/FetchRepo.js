import React,{ useEffect, useState } from "react";

function FetchRepo () {

  const [userDetails, setUserDetails]  = useState([]);
  const [status, setStatus]  = useState(false);

	useEffect(() => {
   
		fetch("")
			.then((res) => res.json())
			.then((json) => {
					setUserDetails(json) ;
					setStatus(true);
			});
    },[]);
		
		if (!status) 
    return <h2> Loading.... </h2> ;

		return (
		  <div>
              <table id="table1">
                <tr>
                    <th>User ID</th>
                    <th>Repo Name</th>
                    <th>No. of Contributors</th>
                </tr>
              </table>

              {
				  userDetails.data.map((data) => (
                          <table key = { data.S_ID }>
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