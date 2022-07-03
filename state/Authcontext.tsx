import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import { Profile } from "../lib/constants";
import { elog, ilog } from "../lib/mylog";
// import { supabase } from "../lib/supabaseClient";
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
  const [profile, setProfile] = useState<Profile | null>(null);
  // const [profile, setProfile] = useSessionStorage<Profile | null>("test-profile-key",null);
  const { user, error } = useUser();


  useEffect(() => {
    setLoading(true);
    if (user) {
      ilog("authcontext->getprofile-> place3--> session hai ",user.user_metadata.avatar_url);
      const getProfile = async () => {
        try {
          //first check if profile exist or not
          const { data: x, error: e } = await supabaseClient
            .from<Profile>("profiles")
            .select('*')
            .eq("id", user?.id!)
            .single();
          if (x) {
            console.log("profile data me hai")
            setProfile(x);
          } else {
            // .single();
            // const user = supabaseClient.auth.user();
            const { data, error } = await supabaseClient
              .from<Profile>("profiles")
              .insert({
                id: user.id,
                role: "USER",
                email: user?.email,
                username: user.user_metadata.full_name,
                avatar_url: user.user_metadata.avatar_url,
                // avatar_url: user.identities[0].identity_data,
                
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
          elog("Authcontext--> useeffect", error.message);
        } finally {
          setLoading(false);
        }
      };
      getProfile();
      // setLoading(false)
    } else {
      ilog("authcontext->getprofile-> place4--> session nahi hai", user);
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  // create signUp, signIn, signOut functions
  const signUpUser = async (redirectUrl: string) => {
    let { user, error } = await supabaseClient.auth.signIn(
      {
        provider: "google",
      },
      {
        redirectTo: redirectUrl,
      }
    );
  };

  const value: AuthContextValues = {
    signInWithgoogle: (redirectUrl: string) => {
      signUpUser(redirectUrl);
    },
    signIn: (data: any) => supabaseClient.auth.signIn(data),
    signOut: (data: any) => supabaseClient.auth.signOut(),
    profile: profile,
  };

  // use a provider to pass down the value
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// export the useAuth hook
export const useAuthContext = () => {
  return useContext(AuthContext);
};
