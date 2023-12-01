import { useAtom } from 'jotai';
import { Card, Row, Col } from 'react-bootstrap';
import { favouritesAtom } from '../../store';
import ArtworkCard from '../../components/ArtworkCard';

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  
  if(!favouritesList) return null;
  
if(favouritesList) {
  return (
      <>
        {favouritesList.length > 0 ?
          <Row className='gy-4'>{favouritesList.map(objID => (
            <Col lg={3} key={objID}><ArtworkCard objectID={objID} /></Col>
          ))}</Row>
          :
          <Card>
            <Card.Body>
              <Card.Text>
                <h4>Nothing Here</h4>Try searching for some artwork.
              </Card.Text>
            </Card.Body>
          </Card>
        }
      </>
    )
  } else {
    return null;
  }
}