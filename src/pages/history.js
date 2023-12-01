import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import ListGroup from 'react-bootstrap/ListGroup';
import { Container, Card, Button, ListGroupItem } from 'react-bootstrap';
import styles from '../styles/History.module.css';
import { searchHistoryAtom } from '../../store';
import { removeFromHistory } from '../../lib/userData';

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();
  if(!searchHistory) return null;
  let parsedHistory = [];

  searchHistory.forEach(h => {
    console.log(h);
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });
  function historyClicked(e, index) {
    e.preventDefault();
    router.push(`/artwork?${searchHistory[index]}`);
  }
  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  if (parsedHistory) {
    return (
        <>
          {parsedHistory.length > 0 ?  
            <Container>{parsedHistory.map((historyItem, index) => (
              <ListGroup variant='flush' key={index}><ListGroupItem onClick={e => historyClicked(e, index)} className={styles.historyListItem}>{Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
              <Button className='float-end' variant='danger' size='sm' onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
              </ListGroupItem>
              </ListGroup>
              ))}</Container> 
            :
            <Card>
              <Card.Body>
                <Card.Text>
                  <h4>Nothing Here</h4>Try searching for something else.
                </Card.Text>
              </Card.Body>
            </Card>
          }
        </>
      )
    } 
}