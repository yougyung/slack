import axios from 'axios';

export const workspaceAPI = {
  async fetchCreateWorkspace(workspace: string, url: string): Promise<any> {
    const { data } = await axios.post(
      '/api/workspaces',
      {
        workspace,
        url,
      },
      {
        withCredentials: true,
      },
    );
    return data;
  },
};
