import styled from 'styled-components';

const Item = styled.li`
  &,
  * {
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    color: ${(props) => props.theme.colors.text};
    text-decoration: none;
    background: none;
    border: none;
    outline: none;
    transition: ${(props) => props.theme.transitions.duration.standard};

    &:hover,
    &:focus {
      opacity: ${(props) => props.theme.hoverOpacity};
    }

    &:focus {
      text-decoration: underline;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

const CardMenuItem: React.FC = ({ children }) => {
  return <Item>{children}</Item>;
};

export default CardMenuItem;
