/*********************************************************************************
*  WEB422 – Assignment 5
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: __Christian Park__ Student ID: _036917128_ Date: __11/16/2023__
*
********************************************************************************/ 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import ArtworkCard from '../../../components/ArtworkCard';
import Error from 'next/error';
import validObjectIDList from '../../../public/data/validObjectIDList.json';

const PER_PAGE = 12;

export default function Artwork() {
  const [artworkList, setArtworkList] = useState(null);
  const [page, setPage] = useState(1);

  const router = useRouter();
  const finalQuery = router.asPath.split('?')[1];
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    if (data) {
      const filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

      const results = [];
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data])

  if (error) {
    return <Error statusCode={404} />;
  }

  if (artworkList === null) {
    return null;
  }

  return (
    <>
      {artworkList.length > 0 ? (
        <Row className='gy-4'>
          {artworkList[page - 1].map((currentObjectID) => (
            <Col lg={3} key={currentObjectID}>
              <ArtworkCard objectID={currentObjectID} />
            </Col>
          ))}
        </Row>
      ) : (
        <Card>
          <h4>Nothing Here</h4>
          Try searching for something else.
        </Card>
      )}
      {artworkList.length > 0 && (
        <Row>
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} disabled={page === 1} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} disabled={page === artworkList.length} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}
