/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi';
import './styles.css';

interface ArrowButtonProps extends React.ComponentProps<'button'> {
  isDown: boolean;
  onClick: React.MouseEventHandler;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  isDown,
  onClick,
  ...rest
}: ArrowButtonProps) => (
  <button className="arrowButton" type="button" onClick={onClick} {...rest}>
    {isDown ? <FiArrowDown /> : <FiArrowUp />}
  </button>
);

export default ArrowButton;
