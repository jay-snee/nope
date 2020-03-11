require 'rails_helper'

RSpec.describe ProcessingMailbox, type: :mailbox do
  context 'with no associated profile' do
    subject do
      receive_inbound_email_from_mail(
        from: 'from-address@example.com',
        to: 'any-old-address@example.com',
        subject: 'Subject Line',
        body: "I'm a sample body"
      )
    end

    it 'should not create a message object' do
      expect { subject }.to change(Message, :count).by(0)
    end

    it 'should bounce the message' do
      expect(subject.status).to eq('bounced')
    end
  end

  context 'with an associated profile' do
    subject do
      profile = FactoryBot.create(:profile)

      receive_inbound_email_from_mail(
        from: 'from-address@example.com',
        to: profile.email_address,
        subject: 'Subject Line',
        body: "I'm a sample body"
      )
    end

    it 'should create a message object' do
      expect { subject }.to change(Message, :count).by(1)
    end

    it 'should mark the message delivered' do
      expect(subject.status).to eq('delivered')
    end
  end

  context 'when reciving html email' do
    subject do
      profile = FactoryBot.create(:profile)
  
      receive_inbound_email_from_mail \
        to: profile.email_address,
        from: 'jay@faircustodian.com',
        subject: 'Beeps',
        body: <<~BODY
          Received: by mx0046p1mdw1.sendgrid.net with SMTP id K5YFoiDBem Wed, 11 Mar 2020 16:16:04 +0000 (UTC)
          Received: from mail-wr1-f42.google.com (mail-wr1-f42.google.com [209.85.221.42]) by mx0046p1mdw1.sendgrid.net (Postfix) with ESMTPS id 1D9FF4CBB56 for <IncreaseFairWide@deba.se>; Wed, 11 Mar 2020 15:48:05 +0000 (UTC)
          Received: by mail-wr1-f42.google.com with SMTP id m9so3240551wro.12 for <IncreaseFairWide@deba.se>; Wed, 11 Mar 2020 08:48:04 -0700 (PDT)
          DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=faircustodian.com; s=google; h=from:mime-version:subject:message-id:date:to; bh=CXVir70apRTECFdpgoTGPiIvYasXbCOJMylwai3y2bY=; b=RdxTWJ+EFeEBTwkhz/PFOGNEGEdn3pYeIX3AZJnShgB43Q590hek2vs91WPpMpCwwL EnnAH7RSosmJqjWtzpGw8qjxezYWQOrNqbMCprA8BZC75ERmJFpZN9fjQpk3Can6vg3k 0m89254+8VYPOQBZoLT31aIX/+cDLZBV+Wz9aMkHX5rZYlCzfL3Zng704WIy7HPUdQhd YABndEh2dNO/dY4YK6fsfYrDOrshBLVGIBnxJVOSLobW42rUWzhZMyB6B4SpcOayFFK0 2Y2Y7TBW50TCnTa949mmMwQFPiJ4c8455nD66Orq/yb9NFWrzu+xCyaID4atDy4PwiSz AsNg==
          X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20161025; h=x-gm-message-state:from:mime-version:subject:message-id:date:to; bh=CXVir70apRTECFdpgoTGPiIvYasXbCOJMylwai3y2bY=; b=M4XIDlvOfh6Ts98N08h6hBB2KnCFM3lgjW09D1LoLgwBJhxmPOUHT2NZuROOZMspEN TVhLZMDdTCpBAG37JTvzOe536kvwupPfnEYGjxxjsCI6sbZ0VT3GB+p8uzAXw7vLCCuY BpwDiTnl5rlT8rteGo9S4xsSCDaIFqgpvcuCL2MuKzzpsG+VnL/SmMyFOA3w503OE2wL wAbFyM2wv0k4WWT+Lt7lxIkjDlfl6kYU/S6cn/87QUUkTq5z602DnZV6t/p5vk7HDX2g ao091ri/w6/6jJFARXJHJiRuZnF9XrMhEHhOk3PVrati/oLvLkRWnzavbA1SgbVn9Cx2 n4Hw==
          X-Gm-Message-State: ANhLgQ05dZTgLgqCJFypSkndH6Coa+Qe3Y0LVW5M0m07rPoGiw7MBdwy hctvJkhoqYAcAH0WQVzAePxo7NqJTxMD9A==
          X-Google-Smtp-Source: ADFU+vsY9KW1JsrjCZT66hBRBOtKY7oP6P3ddKjA+XM98qmKG0cxwagNQOgf30aIP0AKgU9u826u6w==
          X-Received: by 2002:adf:a285:: with SMTP id s5mr5406565wra.118.1583941683651; Wed, 11 Mar 2020 08:48:03 -0700 (PDT)
          Received: from [192.168.0.25] (cpc142546-jarr14-2-0-cust11.16-2.cable.virginm.net. [82.32.134.12]) by smtp.gmail.com with ESMTPSA id a9sm24561828wrv.59.2020.03.11.08.48.02 for <IncreaseFairWide@deba.se> (version=TLS1_2 cipher=ECDHE-RSA-AES128-GCM-SHA256 bits=128/128); Wed, 11 Mar 2020 08:48:02 -0700 (PDT)
          From: Jay Snee <jay@faircustodian.com>
          Content-Type: multipart/alternative; boundary="Apple-Mail=_D4F8D471-C2D7-4D98-A0BC-4A1FE10A6D3E"
          Mime-Version: 1.0 (Mac OS X Mail 13.0 \(3608.60.0.2.5\))
          Subject: Beeps
          Message-Id: <6A743736-2D04-4395-89B6-5C42887E3B2F@faircustodian.com>
          Date: Wed, 11 Mar 2020 15:48:01 +0000
          To: IncreaseFairWide@deba.se
          X-Mailer: Apple Mail (2.3608.60.0.2.5)

          --Apple-Mail=_D4F8D471-C2D7-4D98-A0BC-4A1FE10A6D3E
          Content-Transfer-Encoding: 7bit
          Content-Type: text/plain;
            charset=us-ascii

          Boops

          Jay Snee
          Co-Founder/CTO
          https://www.faircustodian.com

          --Apple-Mail=_D4F8D471-C2D7-4D98-A0BC-4A1FE10A6D3E
          Content-Transfer-Encoding: 7bit
          Content-Type: text/html;
            charset=us-ascii

          <html><head><meta http-equiv="Content-Type" content="text/html; charset=us-ascii"></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class="">Boops<br class=""><div class="">
          <div dir="auto" style="caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none; word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class=""><div><br class="">Jay Snee<br class="">Co-Founder/CTO<br class=""><a href="https://www.faircustodian.com" class="">https://www.faircustodian.com</a></div></div>

          </div>
          <br class=""></body></html>
          --Apple-Mail=_D4F8D471-C2D7-4D98-A0BC-4A1FE10A6D3E--
        BODY
    end

    it 'should have the html content' do
      content = <<-BODY
        <html><head><meta http-equiv="Content-Type" content="text/html; charset=us-ascii"></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class="">Boops<br class=""><div class="">
        <div dir="auto" style="caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none; word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class=""><div><br class="">Jay Snee<br class="">Co-Founder/CTO<br class=""><a href="https://www.faircustodian.com" class="">https://www.faircustodian.com</a></div></div>

        </div>
        <br class=""></body></html>
      BODY

      # expect(subject.mail.text_part).to eq(content)
    end
  end
end
