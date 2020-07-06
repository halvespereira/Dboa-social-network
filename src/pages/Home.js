import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase";

const Home = (props) => {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const [userinfo, setUserinfo] = useState(null);
  const [users, setUsers] = useState([]);
  const newPost = useRef();
  const postButton = useRef();

  useEffect(() => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());

        setUsers(data);
      });
  }, []);

  const logout = (e) => {
    e.preventDefault();
    auth.signOut();
  };

  db.collection("users")
    .doc(props.userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        setUserinfo(doc.data());
      } else {
        console.log("No such document");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  const sendNewPost = (e) => {
    e.preventDefault();

    setUsers(
      users.map((user) =>
        user.userId === userinfo.userId
          ? { ...user, posts: [...user.posts, newPost.current.value] }
          : user
      )
    );

    if (newPost.current.value !== "") {
      db.collection("users")
        .doc(userinfo.userId)
        .update({
          posts: firebase.firestore.FieldValue.arrayUnion(
            newPost.current.value
          ),
        });
      console.log("posts updated successfully");
    }

    newPost.current.value = "";
  };

  const deletePost = (e) => {
    e.persist();

    setUsers(
      users.map((user) =>
        user.userId === userinfo.userId
          ? {
              ...user,
              posts: [
                ...user.posts.filter(
                  (item) =>
                    item !== e.target.closest("div").firstChild.textContent
                ),
              ],
            }
          : user
      )
    );

    db.collection("users")
      .doc(userinfo.userId)
      .update({
        posts: firebase.firestore.FieldValue.arrayRemove(
          e.target.closest("div").firstChild.textContent
        ),
      });
  };

  const follow = async (e) => {
    e.persist();

    if (e.target.textContent === "Follow") {
      e.target.textContent = "Following";
      setUsers(
        users.map((user) =>
          user.userId === e.target.id
            ? { ...user, followers: [...user.followers, userinfo.userId] }
            : user
        )
      );
    } else if (e.target.textContent === "Following") {
      e.target.textContent = "Follow";
      setUsers(
        users.map((user) =>
          user.userId === e.target.id
            ? {
                ...user,
                followers: [
                  ...user.followers.filter((item) => item !== userinfo.userId),
                ],
              }
            : user
        )
      );
    }

    await db
      .collection("users")
      .doc(e.target.id)
      .get()
      .then((doc) => {
        if (!doc.data().followers.includes(userinfo.userId)) {
          db.collection("users")
            .doc(e.target.id)
            .update({
              followers: firebase.firestore.FieldValue.arrayUnion(
                userinfo.userId
              ),
            });
        } else if (doc.data().followers.includes(userinfo.userId)) {
          db.collection("users")
            .doc(e.target.id)
            .update({
              followers: firebase.firestore.FieldValue.arrayRemove(
                userinfo.userId
              ),
            });
        }
      });

    console.log("follow/unfollow successfull");
  };

  if (userinfo) {
    return (
      <div>
        <nav className="homeNav">
          <h3>Dboa Social</h3>
          <button onClick={logout}>Logout</button>
        </nav>
        <div className="homeDiv">
          {/* User Profile */}
          <div>
            <div>
              <h4>{userinfo.name}</h4>
              <h6>Age: {userinfo.age}</h6>
              <h6>Bio: {userinfo.bio}</h6>
              <h6>Followers: {userinfo.followers.length}</h6>
              <form>
                <textarea
                  ref={newPost}
                  placeholder="What's on your mind? "
                ></textarea>
                <div>
                  <button
                    onClick={sendNewPost}
                    ref={postButton}
                    id="postButton"
                  >
                    Post
                  </button>
                </div>
              </form>
              <div>
                {users.map((user) =>
                  user.userId === userinfo.userId
                    ? user.posts.map((post) => (
                        <div className="myPosts">
                          <p>{post}</p>
                          <span onClick={deletePost}>X</span>
                        </div>
                      ))
                    : null
                )}
              </div>
            </div>
          </div>
          {/* Posts */}
          <div>
            {users.map((user) =>
              user.posts.map((post) =>
                user.followers.includes(userinfo.userId) ||
                user.userId === userinfo.userId ? (
                  <div>
                    <p>{post}</p>
                    <small>{user.name}</small>
                  </div>
                ) : null
              )
            )}
          </div>
          {/* Profiles */}
          <div>
            <div>
              {users.map((user) =>
                user.userId !== userinfo.userId ? (
                  <div>
                    <h3>{user.name}</h3>

                    <button onClick={follow} id={user.userId}>
                      {user.followers.includes(userinfo.userId)
                        ? "Following"
                        : "Follow"}
                    </button>
                  </div>
                ) : null
              )}
            </div>
            {/* <Users userId={props.userId} users={users} /> */}
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Home;
