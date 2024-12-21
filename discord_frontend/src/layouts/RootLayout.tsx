import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import { useProfileStore } from "../stores/profileStore";
import { useAuth, useSession } from "@clerk/clerk-react";
import { useMutation } from "@apollo/client";
import {
  CreateProfileMutation,
  CreateProfileMutationVariables,
} from "../gql/graphql";
import { CREATE_PROFILE } from "../graphql/mutations/CreateProfile";
import { useEffect } from "react";

function RootLayout() {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const { session } = useSession();
  const { isSignedIn } = useAuth();

  const [createProfile] = useMutation<
    CreateProfileMutation,
    CreateProfileMutationVariables
  >(CREATE_PROFILE, {});

  useEffect(() => {
    if (!isSignedIn) setProfile(null);
  }, [isSignedIn, setProfile]);

  useEffect(() => {
    const createProfileFn = async () => {
      if (!session?.user) return;

      console.log('session', session?.user);
      try {
        await createProfile({
          variables: {
            input: {
              email: session?.user.emailAddresses[0].emailAddress || session?.user.primaryEmailAddress.emailAddress,
              name: session?.user.fullName || session?.user.username || "",
              imageUrl: session?.user.imageUrl,
            },
          },
          onCompleted: (data) => {
            console.log('state', data.createProfile);
            setProfile(data.createProfile);
          },
        });
      } catch (error) {
        console.log("Error creating profile in Backend", error);
      }
    };
    if (profile?.id) return;
    createProfileFn();
  }, [session?.user, profile?.id]);

  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default RootLayout;
