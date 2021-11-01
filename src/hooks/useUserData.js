import { auth, firestore } from "src/components/firebase";
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useFormControlUnstyled } from "@mui/core";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const[userrole, setUserrole] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
        setUserrole(doc.data()?.roles)
      });
    } else {
      setUsername(null);
      setUserrole(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, userrole };
}