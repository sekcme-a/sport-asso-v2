import React, { useState, useCallback, useContext , useEffect } from "react"
import {firebase, auth, googleAuthProvider, firestore} from "src/components/firebase"
import * as pv from "src/hooks/usePasswordValidation"
import Image from "next/image"
import debounce from 'lodash.debounce';
import { UserContext } from "src/context";
import Router from "next/router"

const SetName = () => {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isUsername, setIsUsername] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    // await checkUsername(formValue)

    if (isValid) {
      // Create refs for both documents
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);
      const userrole = firestore.doc('userrole/user')

      // Commit both docs together as a batch write.
      const batch = firestore.batch();
      batch.set(userDoc, { username: formValue });
      batch.set(usernameDoc, { uid: user.uid });
      batch.set(userrole, {userrole: "user"})

      await batch.commit();
    } else if (formValue.length < 3) {
      alert("닉네임이 너무 짧습니다.")
    }
    else
     {
      alert("중복확인을 해주세요.")
    }
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    // const val = e.target.value.toLowerCase();
    // const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (e.length < 3) {
      setFormValue(e.target.value);
      setIsValid(false);
    } else {
      setFormValue(e.target.value)
    }
    // if (re.test(val)) {
    //   setFormValue(val);
    //   setLoading(true);
    //   setIsValid(false);
    // }
  };

  //

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        if(!exists)
          alert("사용가능한 닉네임입니다!")
        else
          alert("사용중인 닉네임입니다.")
      }
    }, 500),
    []
  );


  useEffect(() => {
    if (username)
      setIsUsername(true)
    else
      setIsUsername(false)
  }, [username])
  
  const gotoHome = () => {
    Router.push("/")
  }

  const onCheckClick = () => {
    checkUsername(formValue)
  }

  return (
    <>
      {
        isUsername? gotoHome(): (
        <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
            <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
            <button type="submit" className="btn-green">
              Choose
            </button>
            </form>
            <div className="check" onClick={onCheckClick}>중복확인</div>
        </section>
        )}
    </>
  );
}
export default SetName;