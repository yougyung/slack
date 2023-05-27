import React, { useCallback, useEffect, useState } from 'react';
import { AddButton, ExitButton, WorkspaceButton, Workspaces } from '../../style';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';
import useSocket from '@hooks/useSocket';
import { Redirect, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from '@common/components/Modal';
import { Button, Input, Label } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';

const WorkspaceList = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
  });
  const [socket, disconnect] = useSocket(workspace);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  const onLogout = useCallback(() => {
    axios
      .post(`/api/users/logout`, null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);
  const onCLickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.stopPropagation();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );
  if (!userData) {
    return <Redirect to="/signIn" />;
  }
  return (
    <>
      <Workspaces>
        {userData?.Workspaces.map((ws: any) => {
          return (
            <Link key={ws.id} to={`/workspace/${ws.url}/chat/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
        <AddButton onClick={onCLickCreateWorkspace}>+</AddButton>
        <ExitButton onClick={onLogout}>
          <img src="/assets/exit.svg" alt="logout" />
        </ExitButton>
      </Workspaces>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>name</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </>
  );
};

export default WorkspaceList;
