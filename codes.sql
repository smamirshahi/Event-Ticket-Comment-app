INSERT INTO events
    (title, descriptions, picture, starting, ending)
VALUES
    ('event1', 'event-description1', 'http://panelsensor.com/img/customers/agile_summit.png', '2011-01-01', '2011-02-01'),
    ('event2', 'event-description2', 'https://images.vexels.com/media/users/3/145234/isolated/lists/931cd261ad78d0c4f0b2ceda893e142b-event-planning-logotype.png', '2012-01-01', '2012-02-01'),
    ('event3', 'event-description3', 'https://i.pinimg.com/736x/c6/9b/6b/c69b6b975bd3eae80fe7116c526d2e7d.jpg', '2013-01-01', '2013-02-01'),
    ('event4', 'event-description4', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTlJHPAaY3MuVFtphGvDR4IQ0WtCjUbMOt_lBsKNabb4wBdGd', '2014-01-01', '2014-02-01')
    ;


INSERT INTO tickets
    (picture, price, descriptions, risks, time_added)
VALUES
    ('https://www.ifleast.org/wp-content/uploads/2017/11/ticket-icon-33738.png', 'price1', 'ticket-description1', 10, '15:30'),
    ('https://abcbelcanto.org/wp-content/uploads/2015/02/tickets.png', 'price2', 'ticket-description2', 20, '16:30'),
    ('https://i1.wp.com/dinoscelebrityroast.com/wp-content/uploads/2017/08/General-Admission-Ticket.png?fit=256%2C256&ssl=1', 'price3', 'ticket-description3', 30, '17:30'),
    ('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTetYisuxbjrBtyUcjfoflFswlpFtPzwWGSSUOfoj9uu8lkqALr', 'price4', 'ticket-description4', 40, '18:30')
    ;


INSERT INTO comments
    (text)
VALUES
    ('comment-text1'),
    ('comment-text1'),
    ('comment-text1'),
    ('comment-text1')
    ;