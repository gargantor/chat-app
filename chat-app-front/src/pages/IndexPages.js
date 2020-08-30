import React from 'react'

const IndexPage = (props) => {
    React.useEffect(()=>{
        const token = localStorage.getItem("CA_Token")
        if(!token){
            props.history.push('/login');
        } else {
            props.history.push("/dashboard")
        }

    }, []);
  return (
    <>
             
    </>
  )
}

export default IndexPage
