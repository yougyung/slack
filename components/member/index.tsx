import { Div } from '@components/DMList/style';
import useSocket from '@hooks/useSocket';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

function Member(member: any) {
  const { workspace } = useParams<{ workspace?: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const [socket] = useSocket(workspace);
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const [option, setOption] = useState<boolean>(false);

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);
  const isOnline = onlineList.includes(member.id);

  return (
    <>
      <Div onClick={() => setOption(!option)}>
        <i
          className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
            isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
          }`}
          aria-hidden="true"
          data-qa="presence_indicator"
          data-qa-presence-self="false"
          data-qa-presence-active="false"
          data-qa-presence-dnd="false"
        />
        <span>{member.nickname}</span>
        {member.id === userData?.id && <span> (나)</span>}
      </Div>
      {option && <option>늘릴것</option>}
    </>
  );
}

export default Member;
