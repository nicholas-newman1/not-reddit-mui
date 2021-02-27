interface Props extends SVGProps {}

const SVG: React.FC<Props> = ({ ariaHidden = false, children }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      aria-hidden={ariaHidden}
    >
      {children}
    </svg>
  );
};

export default SVG;
