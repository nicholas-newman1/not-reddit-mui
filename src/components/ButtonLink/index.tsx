import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';

interface Props extends LinkProps<{}> {
  outlined?: boolean;
  color?: 'primary' | 'secondary';
}

const StyledLink = styled(Link)<Props>`
  display: inline-block;
  outline: none;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  border-width: 1px;
  border-radius: 5000px;
  border-style: solid;
  padding: 0.5em 2em;
  font-size: 0.9rem;
  font-weight: 700;
  transition: ${(props) => props.theme.transitions.duration.standard};

  background: ${(props) => {
    if (props.outlined) return 'rgba(0,0,0,0)';
    if (!props.color) return props.theme.colors.text;
    return props.theme.colors[props.color].main;
  }};

  border-color: ${(props) => {
    if (!props.color) return props.theme.colors.text;
    return props.theme.colors[props.color].main;
  }};

  color: ${(props) => {
    if (props.outlined) {
      if (!props.color) return props.theme.colors.text;
      return props.theme.colors[props.color].main;
    } else {
      if (!props.color) return props.theme.colors.background;
      return props.theme.colors[props.color].text;
    }
  }};

  &:hover,
  &:focus {
    cursor: pointer;
    opacity: ${(props) => props.theme.hoverOpacity};
  }

  &:active {
    transform: scale(0.9);
  }
`;

const ButtonLink: React.FC<Props> = (props) => {
  return <StyledLink {...props}>{props.children}</StyledLink>;
};

export default ButtonLink;
