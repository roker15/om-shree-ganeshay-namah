import { Center } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import { Session } from "@supabase/gotrue-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile } from "../lib/constants";
import { myInfoLog } from "../lib/mylog";
import { supabase } from "../lib/supabaseClient";
interface AuthContextValues {
  signInWithgoogle: (redirectUrl: string) => void;
  signIn: (data: any) => void;
  signOut: (data: any) => void;
  profile: Profile | null;
}
// create a context for authentication
const AuthContext = createContext<AuthContextValues>({
  signInWithgoogle: () => {},
  signIn: () => {},
  signOut: () => {},
  profile: null,
});

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    setSession(supabase.auth.session());

    // window.onstorage = (e) => {
    //   if (e.key === "supabase.auth.token") {
    //     const newSession = JSON.parse(e.newValue!);
    //     setSession(newSession?.currentSession);
    //     setUser(session?.user ?? null);
    //   }
    // };
    // cleanup the useEffect hook
    return () => {
      listener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    if (session) {
      myInfoLog("authcontext->getprofile-> place3--> session hai ", session);
      const getProfile = async () => {
        try {
          //first check if user exist or not
          const { data: x, error: e } = await supabase
            .from<Profile>("profiles")
            .select()
            .eq("id", session.user?.id!)
            .single();
          if (x) {
            setProfile(x);
          } else {
            // .single();
            const user = supabase.auth.user();
            const { data, error } = await supabase
              .from<Profile>("profiles")
              .insert({
                id: user!.id,
                role: "USER",
                email: user?.email,
                username: user?.identities![0].identity_data.full_name,
                avatar_url: user?.identities![0].identity_data.avatar_url,
              })
              .single();
            if (data) {
              setProfile(data);
            }

            if (error) {
              setProfile(null);
              throw error;
            }
          }
        } catch (error: any) {
          // setProfile(null);
          console.log("error", error.message);
        } finally {
          setLoading(false);
        }
      };
      getProfile();
      // setLoading(false)
    } else {
      myInfoLog("authcontext->getprofile-> place4--> session nahi hai", session);
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  // create signUp, signIn, signOut functions
  const signUpUser = async (redirectUrl: string) => {
    let { user, error } = await supabase.auth.signIn(
      {
        provider: "google",
      },
      {
        redirectTo: redirectUrl,
        // redirectTo: "http://localhost:3000",
        // redirectTo: "https://om-shree-ganeshay-namah-git-development4-roker15.vercel.app",
      }
    );
  };

  const value: AuthContextValues = {
    signInWithgoogle: (redirectUrl: string) => {
      signUpUser(redirectUrl);
    },
    signIn: (data: any) => supabase.auth.signIn(data),
    signOut: (data: any) => supabase.auth.signOut(),
    profile: profile,
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <Center h="100vh">
          <CircularProgress isIndeterminate size="40px" thickness="8px" />
        </Center>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuthContext = () => {
  return useContext(AuthContext);
};
