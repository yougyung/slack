import React, { useCallback, useState } from 'react';
import { Channels, MenuScroll, WorkspaceName } from '../../style';
import ChannelList from '../ChannelList';
import DMList from '../DMList';
import InviteChannelModal from '@pages/Workspace/component/InviteChannelModal';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@common/utils/fetcher';
import { IWorkspace } from '@typings/db';

const SideBar = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR('/api/users', fetcher);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  return (
    <>
      <Channels>
        <WorkspaceName> {userData?.Workspaces.find((ws: IWorkspace) => ws.url === workspace)?.name}</WorkspaceName>
        <MenuScroll>
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
