FROM kong:2.4.0-alpine

USER root

RUN apk add gettext

COPY expand-variables.sh /
COPY kong-template.yml /

RUN chmod +x ./expand-variables.sh

CMD [ "./expand-variables.sh" ]
