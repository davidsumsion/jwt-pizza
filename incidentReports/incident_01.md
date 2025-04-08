# Incident: 2025-04-08 15-08-39.632 (UTC)

## Summary

```md
Between the hour of 15:02 and 15:26 on April 8, 2025, 4 users encountered an issue of being unable to purchase jwt-pizzas. The event was triggered by an outage in the jwt factory sometime between 15:02 and 15:08. The remedy included calling a factory url to stop the chaos testing.

A bug in this code caused by chaos being enabled on the factory service. The event was detected by the graphana dashboard. The team started working on the event by 15:20 and began to review latency metrics and logs. This high incident affected 100% of users (who tried to purchase a pizza).
```

## Detection

```md
This incident was not detected as our server latency was set to notify at 165ms. I checked around 15:20 to verify that the script was still performing as expected (I had changed a setting to allow my laptop not to sleep when the display turns off -- I had to run somewhere and the laptop screen turned off while i was gone) When this incident occured there was about 120ms of latency. With traffic of 4 users a threshold of 75-80ms (rather than 160) should have been a proper indicator of an anomoly in the system.

I noticed something was wrong when there was no data in create pizza and there was a static line around 39ms of latency for a couple min and then an abrupt stop. There was also a spike in server latency and number of requests. There was also failed JWT factory logs.

To cut downtime down in the future, I've set the server latency to 80. Additionally with consistent traffic I had routed to the system could have set a no data alert for create pizza latency. I removed this earlier as it was repeatly calling me during times I was not routing traffic to jwt-pizza factory. This would be a good alert to put in place for a future event such as this. 
```

## Impact

```md
For 18 minutes between 15:08 UTC and 15:26 UTC on 04/08/25, our users were unable to buy jwt pizzas.

This incident affected 4 customers 100% of service users, who experienced inability to buy jwt pizzas.

0 support tickets were submitted.
```

## Timeline

```md
All times are UTC.
- _15:02_ - last successful call to jwt factory
- _15:05_ - calls to jwt factory began to have stagnit latency
- _15:09_ - number of get requests spiked from around 9 requests to 48
- _15:20_ - developer checked dashboard and found anomolies
_ _15:26_ - restored functionality of purchases and creation of jwt pizzas
```

## Response

```md
At 15:09 our engineers should have been notified of an anomoly in the system. However the threshold for server latency was not set to the proper threshold and although there was quite a large anomoly our engineer was not alerted.

At 15:20, after checking to verify the traffic script was operating successfully (after laptop screen shut off, but computer did not sleep -- I changed the setting changed this morning and wanted to verify that it worked). It took about 5 minutes (until 15:25) to look at various metrics and logs before finding the url and calling it to end the chaos.
```

## Root cause

```md
A scheduled chaos test occured on jwt factory service. This led to an inability for users to purchase jwt tokens as they could not be made.
```

## Resolution

```md
The service was restored by calling the url: https://cs329.cs.byu.edu/api/report?apiKey=notMyApiKey. The incident was deemed over as users were able to imediately purchase pizzas (there wasn't an issue creating them in the jwt pizza factory).

Time could have been cut in half with proper metric thresholds and alerts set.
```

## Prevention

```md
As of now there are no other related incidents. This incident occured on a system that my team does not control. Further communication and encouragement with them could help the system not go down in the future.

We could inform them not to run a chaos test again on our systems.
```

## Action items

```md
1. Set alerts to proper thresholds for future incidents
2. Contact developer team for jwt pizza factory
3. Develop plan for any future chaos tests
```
