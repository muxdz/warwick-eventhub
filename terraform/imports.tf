import {
  to = aws_vpc.eventhub
  id = "vpc-0523a8b80987a8e66"
}

import {
  to = aws_subnet.public_a
  id = "subnet-05efb1faca6260d58"
}

import {
  to = aws_subnet.public_b
  id = "subnet-0bbbb82e1ac22a50c"
}

import {
  to = aws_subnet.private_a
  id = "subnet-0493ec7544594552e"
}

import {
  to = aws_subnet.private_b
  id = "subnet-06ed08655bc945fab"
}

import {
  to = aws_internet_gateway.eventhub
  id = "igw-0e769447a71d27b18"
}

import {
  to = aws_route_table.public
  id = "rtb-0142aa16c4e8756da"
}

import {
  to = aws_route_table_association.public_a
  id = "subnet-05efb1faca6260d58/rtb-0142aa16c4e8756da"
}

import {
  to = aws_route_table_association.public_b
  id = "subnet-0bbbb82e1ac22a50c/rtb-0142aa16c4e8756da"
}

import {
  to = aws_security_group.alb
  id = "sg-09e03b0ae33ac27ba"
}

import {
  to = aws_security_group.api
  id = "sg-0bcf64366cd9e1b1b"
}

import {
  to = aws_security_group.db
  id = "sg-0f68687903dd02571"
}
