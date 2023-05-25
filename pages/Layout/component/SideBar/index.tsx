import React, { useCallback, useState } from 'react';
import { Channels, MenuScroll, WorkspaceName } from '../../style';
import Menu from '@components/Menu';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import InviteChannelModal from '@components/InviteChannelModal';
import { useParams } from 'react-router';

const SideBar = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  return (
    <>
      <Channels>
        <WorkspaceName>{workspace}</WorkspaceName>
        <MenuScroll>
          <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}></Menu>
          <ChannelList />
          <DMList />
        </MenuScroll>
      </Channels>
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      ></InviteChannelModal>
    </>
  );
};

export default SideBar;