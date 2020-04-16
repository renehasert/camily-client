import React, { useState } from "react";
import {
  format,
  eachDayOfInterval,
  addMonths,
  addYears,
  endOfMonth,
  startOfMonth,
  getWeek,
  getDay,
  addDays,
} from "date-fns";
import Day from "./day";
import "./style.scss";
import { Button, Table, Container, Row, Col } from "react-bootstrap";

export default function Index() {
  const [incrementMonth, setIncrementMonth] = useState(0);
  const [incrementYear, setIncrementYear] = useState(0);
  const [locale, setLocale] = useState("en-US");

  const date = new Date();
  const month = addYears(addMonths(date, incrementMonth), incrementYear);
  const startMonth = format(startOfMonth(month), "d");
  const endMonth = format(endOfMonth(month), "d");
  const firstDay = getDay(startOfMonth(month));

  let calendar = [];

  // For every day in the month, set up the information of that day
  for (var i = startMonth; i <= endMonth; i++) {
    const newDate = new Date(
      parseInt(format(month, "yyyy")),
      parseInt(format(month, "M")) - 1, // the month is 0-indexed
      parseInt(i)
    );
    // Get the days as strings, for the information per day
    const dayString = new Intl.DateTimeFormat(locale, {
      weekday: "long",
    }).format(newDate);

    // Push the information per day
    calendar.push({
      id: parseInt(i),
      dayOfTheWeek: getDay(newDate),
      dayString: dayString.charAt(0).toUpperCase() + dayString.slice(1),
      weekNumber: getWeek(newDate),
      day: parseInt(i),
      month: parseInt(format(month, "M")),
      year: parseInt(format(month, "yyyy")),
    });
  }
  // If the first day of the month is not a monday, add 'hollow days' to fill in the Table.
  if (firstDay !== 1) {
    const hollowDays = Array(Math.abs(1 - firstDay));
    hollowDays.fill({ id: 0, day: null, dayOfTheWeek: 7 }, 0);
    calendar = hollowDays.concat(calendar);
  }

  // Create the week rows for the table
  function week(days, len) {
    let weeks = [],
      i = 0,
      n = days.length;
    while (i < n) {
      weeks.push(days.slice(i, (i += len)));
    }
    return weeks;
  }

  // Get the day Strings of a random week, for the Table headers
  const daysOfTheWeek = eachDayOfInterval({
    start: new Date(new Date("December 25, 1995 23:15:30")),
    end: new Date(addDays(new Date("December 25, 1995 23:15:30"), 6)),
  });

  // console.log(week(calendar, 7));
  // console.log("calendar", calendar);
  // console.log();

  return (
    <Container className='main'>
      <Row className='month'>
        <Col>
          <Button
            size='lg'
            variant='outline-secondary'
            onClick={() => setIncrementMonth(incrementMonth - 1)}>
            {" "}
            {"<"}{" "}
          </Button>
        </Col>
        <Col>{format(month, "MMMM, yyyy")}</Col>
        <Col>
          <Button
            size='lg'
            variant='outline-secondary'
            onClick={() => setIncrementMonth(incrementMonth + 1)}>
            {" "}
            {">"}{" "}
          </Button>
        </Col>
      </Row>
      <Table responsive='md' borderless className='table'>
        <thead>
          <tr>
            {daysOfTheWeek.map((day, index) => (
              <th key={index}>
                {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
                  day
                )}
              </th>
            ))}
          </tr>
        </thead>
        {week(calendar, 7).map((week, index) => (
          <tbody key={index}>
            <tr>
              {week.map((day, index) => (
                <Day key={index} {...day} />
              ))}
            </tr>
          </tbody>
        ))}
      </Table>
    </Container>
  );
}
