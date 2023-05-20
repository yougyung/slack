import styled from '@emotion/styled';

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
    }
  `};
`;

export const Div = styled.div`
  background: #1e293b;
  width: 14rem;
  height: 5rem;
  border-radius: 1rem;
  padding: 8px 36px;
  margin: 1rem;
`;
