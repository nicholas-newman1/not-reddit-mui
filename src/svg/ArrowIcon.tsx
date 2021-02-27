import SVG from './SVG';

const ArrowIcon = (props: SVGProps) => {
  return (
    <SVG {...props}>
      <path d='M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z' />
    </SVG>
  );
};

export default ArrowIcon;
