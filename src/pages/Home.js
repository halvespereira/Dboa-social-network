import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase";

const Home = (props) => {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const [userinfo, setUserinfo] = useState(null);
  const [allposts, setAllposts] = useState(null);
  const [users, setUsers] = useState([]);
  const newPost = useRef();
  const postButton = useRef();

  useEffect(() => {
    db.collection("users")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        const posts = snapshot.docs.reduce((acc, doc) => {
          doc.data().posts.map((post) => acc.push(post));

          return acc;
        }, []);

        setUsers(data);
        setAllposts(posts);
      });
  }, [db]);

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
          ? {
              ...user,
              posts: [
                ...user.posts,
                {
                  post: newPost.current.value,
                  milliseconds: new Date().getTime(),
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString(),
                },
              ],
            }
          : user
      )
    );

    if (newPost.current.value !== "") {
      db.collection("users")
        .doc(userinfo.userId)
        .update({
          posts: firebase.firestore.FieldValue.arrayUnion({
            post: newPost.current.value,
            milliseconds: new Date().getTime(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
          }),
        });
      console.log("posts updated successfully");
    }

    newPost.current.value = "";
  };

  const deletePost = (e) => {
    e.persist();

    const array = users.reduce((acc, user) => {
      if (user.userId === userinfo.userId) {
        const deletePost = user.posts.find(
          (post) => post.post === e.target.closest("div").firstChild.textContent
        );
        acc.post = deletePost.post;
        acc.milliseconds = deletePost.milliseconds;
        acc.date = deletePost.date;
        acc.time = deletePost.time;
      }
      return acc;
    }, {});

    db.collection("users")
      .doc(userinfo.userId)
      .update({
        posts: firebase.firestore.FieldValue.arrayRemove(array),
      });

    setUsers(
      users.map((user) =>
        user.userId === userinfo.userId
          ? {
              ...user,
              posts: [
                ...user.posts.filter(
                  (item) =>
                    item.post !== e.target.closest("div").firstChild.textContent
                ),
              ],
            }
          : user
      )
    );
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
            <div className="profile-Info-Post">
              {users.map((user, idx) =>
                user.userId === userinfo.userId ? (
                  <div className="profileDiv" key={idx}>
                    <h4>{user.name}</h4>
                    <p>
                      <strong>Age: </strong> {user.age}
                    </p>
                    <p>
                      <strong>Bio: </strong> {user.bio}
                    </p>
                    <p>
                      <strong>Followers: </strong> {user.followers.length}
                    </p>
                    <p>
                      <strong>Posts: </strong> {user.posts.length}
                    </p>
                  </div>
                ) : null
              )}

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
            </div>
          </div>

          {/* My posts */}
          <div className="myPostsOuter">
            <h5>My Posts</h5>
            <div className="myPostsList">
              {users.map((user) =>
                user.userId === userinfo.userId
                  ? user.posts.map((post, idx) =>
                      post.post ? (
                        <div key={idx}>
                          <div>
                            <small>On {post.date} </small>
                            <small>at: {post.time} I said:</small>
                          </div>
                          <div className="myPosts">
                            <p>{post.post}</p>
                            <span onClick={deletePost}>X</span>
                          </div>
                        </div>
                      ) : null
                    )
                  : null
              )}
            </div>
          </div>
          {/* Posts */}
          <div className="posts">
            <h5>All Posts</h5>
            <div className="postsList">
              {users.map((user) =>
                user.posts.map((post, idx) =>
                  user.followers.includes(userinfo.userId) ||
                  (user.userId === userinfo.userId && post.post) ? (
                    <div key={idx} className="post">
                      <small>On {post.date} </small>
                      <small>at: {post.time} </small>
                      <small>{user.name}: </small>
                      <p>{post.post}</p>
                    </div>
                  ) : null
                )
              )}
            </div>
          </div>

          {/* Profiles */}
          <div>
            <div className="users">
              {users.map((user, idx) =>
                user.userId !== userinfo.userId ? (
                  <div key={idx} className="user">
                    <h5>{user.name}</h5>
                    <p>
                      <strong>Age: </strong>
                      {user.age}
                    </p>
                    <p>
                      <strong>Bio: </strong>
                      {user.bio}
                    </p>
                    <p>
                      <strong> Followers: </strong>
                      {user.followers.length}
                    </p>
                    <p>
                      <strong>Posts: </strong>
                      {user.posts.length}
                    </p>
                    <button
                      className="usersFollowButton"
                      onClick={follow}
                      id={user.userId}
                    >
                      {user.followers.includes(userinfo.userId)
                        ? "Following"
                        : "Follow"}
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
};

export default Home;
