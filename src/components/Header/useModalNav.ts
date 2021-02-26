import { useEffect, useRef, useState } from 'react';
import { getAllChildren } from '../../utils';

const useModalNav = () => {
  const [displayNav, setDisplayNav] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const icon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.querySelector('html')!;

    /* don't close nav if any of these targets are clicked */
    const targets = [
      nav.current, // the nav
      icon.current, // the user icon
      ...getAllChildren(icon.current!), // any nested children
    ];

    /* click event handler, decide whether to close nav */
    const handleClick = (e: MouseEvent) => {
      if (!targets.some((child) => child === e.target)) setDisplayNav(false);
    };

    html.addEventListener('click', handleClick);

    return () => {
      html.removeEventListener('click', handleClick);
    };
  }, []);

  return { displayNav, setDisplayNav, nav, icon };
};

export default useModalNav;
