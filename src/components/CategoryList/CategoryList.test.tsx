import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CategoryList from '.';

const categories = [
  {
    categoryHref: '/categories/meditation',
    categoryId: 'meditation',
    isOwner: false,
    numOfSubscribers: 123,
    onToggleSubscribe: () => {},
    subscribed: false,
    loading: false,
  },
  {
    categoryHref: '/categories/hockey',
    categoryId: 'hockey',
    isOwner: false,
    numOfSubscribers: 321,
    onToggleSubscribe: () => {},
    subscribed: false,
    loading: false,
  },
  {
    categoryHref: '/categories/running',
    categoryId: 'running',
    isOwner: false,
    numOfSubscribers: 8673,
    onToggleSubscribe: () => {},
    subscribed: false,
    loading: false,
  },
];

describe('<CategoryList />', () => {
  it('should render without exploding', () => {
    render(
      <MemoryRouter>
        <CategoryList categories={categories} loading={false} />
      </MemoryRouter>
    );
  });

  it('should render a list', () => {
    const { getByRole } = render(
      <MemoryRouter>
        <CategoryList categories={categories} loading={false} />
      </MemoryRouter>
    );

    getByRole('list');
  });

  it('should render a list item for each category', () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <CategoryList categories={categories} loading={false} />
      </MemoryRouter>
    );

    expect(categories.length).toBe(getAllByRole('listitem').length);
  });
});
