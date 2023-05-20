// import useSocket from '@hooks/useSocket';
import OptionBox from '@common/components/OptionBox';
import CreateChannelModal from '@components/CreateChannelModal';
import { CollapseButton, Div } from '@components/DMList/style';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
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
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>채널</span>
        <span style={{ paddingRight: '20px', float: 'right' }} onClick={onClickAddChannel}>
          +
        </span>
      </h2>
      <div style={{ maxHeight: '40%', overflow: 'scroll' }}>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              // <NavLink
              //   key={channel.name}
              //   activeClassName="selected"
              //   to={`/workspace/${workspace}/channel/${channel.name}`}
              // >
              //   <span># {channel.name}</span>
              // </NavLink>
              <Div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div>
                  <span> {channel.name}</span>
                </div>
                <OptionBox />
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
