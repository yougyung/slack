import styled from '@emotion/styled';

export const CategoryBox = styled.div`
  position: relative;
  display: flex;
  bottom: -21px;
`;
export const Category = styled.div`
  padding: 0 10px;
  color: #71717a;
  &: hover {
    font-weight: 700;
    color: #171c20;
    border-bottom: 2px solid #dfdfdf;
  }
`;

export const Header = styled.header`
  height: 64px;
  min-width:300px;
  display: flex;
  width: 100%;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;
  justify-content:space-between;
  
  & .header-right {
    &-add{
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    font-weight:600;
    
`;
