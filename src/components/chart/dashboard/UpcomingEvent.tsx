'use client';
import Link from 'next/link';
import { ListGroup, ListGroupItem, Stack } from 'react-bootstrap'

const formatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const dateFormatter = (date: Date) => {
  return formatter.format(new Date(date)).replace(',', '');
}

const UpcomingEvent = ({ upcoming, ongoing }: { upcoming: EventForm[], ongoing: EventForm[] }) => {
  return (
    <div className='px-4'>
      <h3 className='text-center mb-4'>Jadwal Acara</h3>
      <Stack gap={4}>
        {
          ongoing.length > 0 && (
            <div>
              <Link href="">
                <h5 className='border-bottom'>Sedang Berlangsung</h5>
              </Link>
              <ListGroup variant="flush">
                {
                  ongoing.map((item, index) => {
                    return (
                      <ListGroupItem key={index} className='white-shade'>
                        <div className='d-flex w-100 align-items-center justify-content-between'>
                          <strong className='w-50 text-truncate'>{index + 1}. {item.title}</strong>
                          <span className='w-50 text-end'>
                            {dateFormatter(item.start)} - {dateFormatter(item.end)}
                          </span>
                        </div>
                      </ListGroupItem>
                    )
                  })
                }
              </ListGroup>
            </div>
          )
        }

        {
          upcoming.length > 0 && (
            <div>
              <h5 className='border-bottom'>Mendatang</h5>
              <ListGroup variant="flush">
                {
                  upcoming.map((item, index) => {
                    return (
                      <ListGroupItem key={index}>
                        <div className='d-flex w-100 align-items-center justify-content-between'>
                          <strong className='w-50 text-truncate'>{index + 1}. {item.title}</strong>
                          <span className='w-50 text-end'>
                            {dateFormatter(item.start)} - {dateFormatter(item.end)}
                          </span>
                        </div>
                      </ListGroupItem>
                    )
                  })
                }
              </ListGroup>
            </div>
          )
        }
      </Stack>
    </div>
  )
}

export default UpcomingEvent