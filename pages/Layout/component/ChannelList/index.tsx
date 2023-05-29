import CreateChannelModal from '@pages/Layout/component/CreateChannelModal';
import { CollapseButton, Div } from '@pages/Layout/component/DMList/style';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';
import React, { FC, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const ChannelList: FC = () => {
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateChannelModal(false);
  }, []);

  return (
    <>
      <div style={{ display: 'flex', padding: '10px 0' }}>
        <span style={{ fontWeight: 700, fontSize: '14px', padding: '0 36px' }}>채널</span>
        <div style={{ width: '18px' }} onClick={onClickAddChannel}>
          <img src="/assets/create.svg" />
        </div>
      </div>
      <div style={{ maxHeight: '50%', overflow: 'scroll' }}>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <Div key={channel.name}>
                <NavLink
                  key={channel.name}
                  activeClassName="selected"
                  to={`/workspace/${workspace}/chat/${channel.name}`}
                >
                  <img src="/assets/hashtag.svg" style={{ width: '10px' }} />
                  <span style={{ fontWeight: 800 }}> {channel.name}</span>
                </NavLink>
              </Div>
            );
          })}
      </div>
      <CreateChannelModal
        show={showCreateChannelModal}
        onCloseModal={onCloseModal}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />
    </>
  );
};

export default ChannelList;
