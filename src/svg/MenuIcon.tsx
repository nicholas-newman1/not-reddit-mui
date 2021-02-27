import SVG from './SVG';

const MenuIcon = (props: SVGProps) => {
  return (
    <SVG {...props}>
      <path d='M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z' />
    </SVG>
  );
};

export default MenuIcon;
