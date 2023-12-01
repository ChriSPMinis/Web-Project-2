import { useRouter } from 'next/router';
import { searchHistoryAtom } from '../store';
import { useAtom } from 'jotai';
import { Container, Nav, Navbar, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { readToken, removeToken } from '../lib/authenticate';
import { addToHistory } from '../lib/userData';

export default function MainNav() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  let token = readToken();
  async function submitForm(e){
    e.preventDefault();
    setIsExpanded(false)
    let queryString = `/artwork?title=true&q=${searchField}`;
    let queryParams = `title=true&q=${searchField}`;

    if(searchField != '') {
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
      router.push(queryString);
      setSearchField('');
    }
  }

  function setIsExpandedToFalse() {
    setIsExpanded(false);
  }
  function toggleExp() {
    setIsExpanded(!isExpanded);
  }
  function logout() {
    removeToken();
    router.push('/');
  }

  return (
    <>
    <Navbar onSelect={setIsExpandedToFalse} expand='lg' expanded={isExpanded} className='fixed-top navbar-dark bg-primary'>
      <Container>
        <Navbar.Brand>Christian Park</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' onClick={toggleExp} />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav  className='me-auto'>
             <Link href='/' passHref legacyBehavior><Nav.Link active={router.pathname === '/'}>Home</Nav.Link></Link>
            {token && <Link href='/search' passHref legacyBehavior><Nav.Link active={router.pathname === '/search'}>Advanced Search</Nav.Link></Link>}
          </Nav>
          &nbsp;{token && <Form className='d-flex' onSubmit={submitForm}>
            <Form.Control
              type='search'
              placeholder='Search'
              className='me-2'
              aria-label='Search'
              value={searchField} onChange={(e) => setSearchField(e.target.value)}
            />
            <Button type='submit' variant='success'>Search</Button>
          </Form>}&nbsp;
          {token && <Nav>
          <NavDropdown title={token.userName} id='collapsible-nav-dropdown'>
              <Link variant='primary' href='/favourites' passHref legacyBehavior><NavDropdown.Item active={router.pathname === '/favourites'} onClick={(e) => setIsExpandedToFalse}>Favourites</NavDropdown.Item></Link>
              <Link variant='primary' href='/history' passHref legacyBehavior><NavDropdown.Item active={router.pathname === '/history'} onClick={(e) => setIsExpandedToFalse}>Search History</NavDropdown.Item></Link>
            </NavDropdown>
                  </Nav>}
          <Nav className='ml-auto'>
            {!token && <Link href='/login' passHref legacyBehavior><Nav.Link>Login</Nav.Link></Link>}
            {!token && <Link href='/register' passHref legacyBehavior><Nav.Link>Register</Nav.Link></Link>}
            {token && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br /><br /><br />
    </>
  );
}