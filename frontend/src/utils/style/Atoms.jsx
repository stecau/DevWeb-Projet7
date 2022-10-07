import { Link } from "react-router-dom";
import colors from "./colors";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Loader = styled.div`
    padding: 10px;
    border: 6px solid ${colors.primary};
    border-bottom-color: transparent;
    border-radius: 22px;
    animation: ${rotate} 1s infinite linear;
    height: 0;
    width: 0;
`;

export const StyledLink = styled(Link)`
    margin: 5px;
    padding: 10px 15px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
    text-decoration: none;
    font-size: 18px;
    text-align: center;
    ${(props) =>
        props.$isActivated &&
        `color: ${colors.fontDark}; 
        border-radius: 30px; 
        background-color: ${colors.primary};`};
    ${(props) =>
        props.$isCreation &&
        `color: ${props.theme === "light" ? colors.secondary : colors.tertiary};
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px; 
        background-color: ${
            props.theme === "light" ? colors.tertiary : colors.secondary
        };`};
    ${(props) =>
        props.$isCard &&
        `color: ${props.theme === "light" ? colors.fontLight : colors.fontDark};
            padding: 0px;
            background-color: ${
                props.theme === "light" ? colors.secondary : colors.tertiary
            };`};
`;

export const StyledButton = styled.button`
    margin: 5px;
    padding: 10px 15px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
    text-decoration: none;
    font-size: 18px;
    text-align: center;
    border: none;
    cursor: pointer;
    ${(props) =>
        props.$isActivated &&
        `color: ${colors.fontDark}; 
        border-radius: 30px; 
        background-color: ${colors.primary};`};
    ${(props) =>
        props.$isCreation &&
        `color: ${props.theme === "light" ? colors.secondary : colors.tertiary};
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px; 
        background-color: ${
            props.theme === "light" ? colors.tertiary : colors.secondary
        };`};
`;
