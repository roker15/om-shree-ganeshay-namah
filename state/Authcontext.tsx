import { Session, User } from "@supabase/gotrue-js";
import React, { useContext, useState, useEffect, createContext } from "react";
import { Profile } from "../lib/constants";
import { supabase } from "../lib/supabaseClient";
interface AuthContextValues {
  signUp: (email: string, role: string) => void;
  signIn: (data: any) => void;
  signOut: (data: any) => void;
  user: User | null;
  role?: string | null;
  username: string | null;
}
// create a context for authentication
const AuthContext = createContext<AuthContextValues>({
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},

  user: null,
  role: null,
  username: null,
});

export const AuthProvider = ({ children }: any) => {
  // create state values for user data and loading
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // get session data if there is an active session
    const session = supabase.auth.session();

    // setUser(session?.user ?? null);
    setSession(session); //set new session so that it can trigger profile update.
    setUser(session?.user ?? null); // this line may be unnecessary, get user from session.
    setLoading(false);

    // listen for changes to auth
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("session is ", session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // cleanup the useEffect hook
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session]);

  function setProfile(profile: Profile | null) {
    setAvatar(profile!.avatar_url);
    setUsername(profile!.username);
    setRole(profile!.role);
    // setWebsite(profile.website)
  }
  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const { data, error } = await supabase
        .from<Profile>("profiles")
        .select(`username, website, avatar_url,role`)
        .eq("id", user!.id)
        .single();

     
      if (data && data.username && data.role&& data.avatar_url) {
        setProfile(data);
        return;
      }
      if (data && data!==null) {
        const { data } = await supabase
          .from<Profile>("profiles")
          .update({ role: "USER",username:user?.user_metadata.full_name,avatar_url:user?.user_metadata.avatar_url })
          .eq("id", user!.id)
          .single();
        setProfile(data);
        return;
      }
      const { data: profile } = await supabase
        .from<Profile>("profiles")
        .insert({ id: user!.id, role: "USER", email: user?.email,username:user?.user_metadata.full_name,avatar_url:user?.user_metadata.avatar_url })
        .single();

      setProfile(profile);

      if (error) {
        console.log("profile is error");
        throw error;
      }

      // console.log("profile is role", data?.role);
    } catch (error: any) {
      setUsername("");
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  }

  // create signUp, signIn, signOut functions
  const signUpUser = async (email: string, role: string) => {
    console.log("email is ", email);
    console.log("role is ", role);
    // const { user, error } = await supabase.auth.signIn({ email });
    let { user, error } = await supabase.auth.signIn(
      {
        provider: "google",
      },
      {
        // redirectTo: "http://localhost:3000"
        redirectTo: "https://om-shree-ganeshay-namah-git-development3-roker15.vercel.app",
     
      }
    );
    console.log(
      "signUp is being called bhaiiiiiiiiiiiiiiiiiiiiiii   ",
      console.log(user)
    );

    const { data } = await supabase
      .from<Profile>("profiles")
      .upsert({ id: user?.id, role: role });
  };

  const value: AuthContextValues = {
    signUp: (email: string, role: string) => {
      signUpUser(email, role);
    },
    signIn: (data: any) => supabase.auth.signIn(data),
    signOut: (data: any) => supabase.auth.signOut(),
    user,

    username: username,
    role: role,
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuthContext = () => {
  return useContext(AuthContext);
};
