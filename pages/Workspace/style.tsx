import styled from '@emotion/styled';

export const WorkspaceWrapper = styled.div`
  display: flex;
  flex: 1;
`;

export const Workspaces = styled.div`
  width: 65px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #1e293b;
  vertical-align: top;
  text-align: center;
  padding: 15px 5px;
`;

export const Channels = styled.nav`
  width: 260px;
  display: inline-flex;
  flex-direction: column;
  background: #1e293b;
  color: rgb(188, 171, 188);
  vertical-align: top;
  & a {
    padding-left: 36px;
    color: inherit;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    &.selected {
      color: white;
    }
  }
  & .bold {
    color: white;
    font-weight: bold;
  }
  & .count {
    margin-left: auto;
    background: #cd2553;
    border-radius: 16px;
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    height: 18px;
    line-height: 18px;
    padding: 0 9px;
    color: white;
    margin-right: 16px;
  }
  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const Users = styled.nav`
  width: 260px;
  display: inline-flex;
  background: #0f172a;
  color: rgb(188, 171, 188);
  vertical-align: top;

  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const WorkspaceName = styled.button`
  line-height: 64px;
  border: none;
  text-shadow: 2px 2px 2px gray;
  width: 100%;
  font-weight: 900;
  font-size: 24px;
  background: #1e293b;
  text-overflow: ellipsis;
  overflow: hidden;
  color: white;
  cursor: pointer;
`;

export const MenuScroll = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
  margin-left: 10px;
  padding: 5px 0;
  border-radius: 10px 0;
  background: #0f172a;
`;

export const AddButton = styled.button`
  color: white;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const ExitButton = styled.button`
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
`;

export const WorkspaceButton = styled.button`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  border: none;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    border-radius: 10px;
    background-color: white;
  }
`;
