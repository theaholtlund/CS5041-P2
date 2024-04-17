import { useState, useEffect } from "react";
import { Card, Button, Text } from "react-native-paper";

import PostCardAvatar from "./PostCardAvatar";

import { auth, database } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, child, remove, push, serverTimestamp } from "firebase/database";
import { useList } from 'react-firebase-hooks/database';
import { signInAnonymously } from "firebase/auth";

export default function PostCard(props) {
  const [isLiked, setIsLiked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);

  const [user, authLoading, authError] = useAuthState(auth);

  const [privateSnapshots, dbLoading, dbError] = useList(
    user ? ref(database, `/public/${user.uid}`) : null
  );

  const [snapshots] = useList(
    user ? ref(database, "/public") : null
  );

  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  const handleOnLikePress = () => {
    setIsLiked(true);
    push(child(user ? ref(database) : null, `/public/${user.uid}`), {
      type: "FoodLike",
      created: serverTimestamp(),
      modified: serverTimestamp(),
      message: user.uid,
      content: props.content,
    });
  };

  const handleOnUnLikePress = () => {
    setIsLiked(false);
    
    snapshots
        .flatMap((el) => Object.entries(el.val()))
        .filter((el) => el[1].type == "FoodLike")
        .filter((el) => el[1].content == props.content)
        .map( (el) => {
          remove(ref(database, `/public/${user.uid}/${el[0]}`)
        )});
        
  };

  useEffect(() => {
    let liked = snapshots.flatMap((el) => Object.entries(el.val()))
      .filter((el) => el[1].type == "FoodLike")
      .filter((el) => el[1].content == props.content)
      .length
    setLikeCount(liked)

    let isLike = snapshots.flatMap((el) => Object.entries(el.val()))
    .filter((el) => el[1].type == "FoodLike")
    .filter((el) => el[1].message == user.uid)
    .filter((el) => el[1].content == props.content)
    .length
    
    if(isLike == 0) {
      setIsLiked(false)
    } else {
      setIsLiked(true)
    }
  }, [snapshots]);

  return (
    <Card
      style={{
        margin: 10,
        width: 500,
      }}
    >
      <Card.Title
        title="Moment"
        subtitle={`${likeCount} likes`}
        left={PostCardAvatar}
      />
      <Card.Content>
        <Text variant="bodyMedium">{props.message}</Text>
      </Card.Content>
      <Card.Cover source={{ uri: props.content }} />
      <Card.Actions>
        {isLiked ? <Button model='contained' onPress={ handleOnUnLikePress }>unLike</Button> 
        : <Button model='contained' onPress={ handleOnLikePress }>Like</Button>}
      </Card.Actions>
    </Card>
  );
}
