#!make

VERSION=$(shell ./.version.sh)

BUILDPATH=$(shell pwd)/build
OUT=$(shell pwd)/out
SNAP=$(shell pwd)/strangescout.snap

NAME = team1533/strangescout
IMG = $(NAME):$(VERSION)
LATEST = $(NAME):latest
EDGE = $(NAME):edge
 

out:
	@printf "\n Creating build directories\n";
	mkdir -p $(BUILDPATH)/frontend
	mkdir -p $(BUILDPATH)/output

	@printf "\n Copying sources\n";
	cd server; tar cf - --exclude='node_modules' --exclude='static' --exclude='dbs/*' * | ( cd $(BUILDPATH)/output; tar xfp -)
	cd frontend/web; tar cf - --exclude='node_modules' --exclude='dist' * | ( cd $(BUILDPATH)/frontend; tar xfp -)

	@printf "\n Setting version %s\n" "$(VERSION)";
	sed -i s/0.0.0/$(VERSION)/ $(BUILDPATH)/frontend/src/environments/environment.prod.ts;

	@printf "\n Installing frontend dependencies\n";
	@cd $(BUILDPATH)/frontend; \
	npm i;

	@printf "\n Copying build leveldown dep to output\n";
	mkdir -p $(BUILDPATH)/output/node_modules/
	cp -r $(BUILDPATH)/frontend/node_modules/leveldown $(BUILDPATH)/output/node_modules/leveldown

	@printf "\n Building frontend\n";
	@cd $(BUILDPATH)/frontend; \
	./node_modules/.bin/ng build --prod --aot --source-map=false --build-optimizer --progress --output-path=$(BUILDPATH)/output/static;

	@printf "\n Installing server dependencies\n";
	@cd $(BUILDPATH)/output; \
	npm i --production;

	@printf "\n Relocating output\n";
	mv $(BUILDPATH)/output $(OUT);

	@printf "\n Cleaning build files\n";
	rm -rf $(BUILDPATH);

	@printf "\n Creating version file\n";
	echo $(VERSION) > $(OUT)/version;

	@printf "\n Done!";

.PHONY: clean docker snap
clean:
	@echo " Cleaning...";
	rm -rf $(BUILDPATH);
	rm -rf $(OUT);
	rm -rf $(SNAP);

snap: out
	snapcraft snap -o $(SNAP);

docker: out
	docker image build -f docker/Dockerfile -t $(IMG) ./
	docker tag $(IMG) $(EDGE)
	if git describe --tags --exact-match > /dev/null 2>&1; then docker tag $(IMG) $(LATEST); fi
