import Modal from '@common/components/Modal';
import { Button, Input, Label } from '@pages/SignUp/style';
import React, { VFC, useCallback } from 'react';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@common/utils/fetcher';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}
const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{
    workspace: string;
  }>();

  const { data: userData } = useSWR<IUser | false>(`/api/users`, fetcher, {
    dedupingInterval: 2000,
  });

  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          setShowCreateChannelModal(false);
          mutateChannel();
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>channel</span>
          <Input id="workspace" value={newChannel} onChange={onChangeNewChannel} />
        </Label>

        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
