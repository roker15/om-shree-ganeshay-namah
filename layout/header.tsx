import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useContext, useEffect,  useState } from "react";
// import { AuthContext } from "../auth";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Header() {
  const [state, setState] = useState(5);
  // const [email, setEmail] = useState(useContext(AuthContext));
  const changeState = () => {
    setState(state + 1);
  };
  // const contextValue = useContext(AuthContext);
  // // Update the document title using the browser API
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   if (email=="") {
  //     if (contextValue.user) {
  //       console.log("vlaue from context", contextValue.user.email)
  //       setEmail(contextValue.user.email!)
  //     } else {
  //       console.log("abhi value nahi aaya hai")
  //     }
  //   }
  // },[]);

  // const email =useContext(AuthContext)


  



  const [auth, setAuth] = useState(
		false //|| window.localStorage.getItem('auth') === 'true'
	);
  return (
    <>
      <Image
        src="/vercel.svg" // Route of the image file
        height={75} // Desired size with correct aspect ratio
        width={75} // Desired size with correct aspect ratio
        alt="Your Name"
        // priority={true}
      />

      <h1>this is part of layout {state}</h1>
      {/* <h1>this is part of layout {useContext(AuthContext).user?.email}</h1> */}
      <button onClick={changeState}>change state</button>
      {/* <div className={styles.main}>{children}</div> */}
    </>
  );
}
