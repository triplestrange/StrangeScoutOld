#!make

BUILDPATH=$(shell pwd)/build
OUT=$(shell pwd)/out
SNAP=$(shell pwd)/strangescout.snap

build:
	@printf "\n Creating build directories\n";
	mkdir -p $(BUILDPATH)/frontend
	mkdir -p $(BUILDPATH)/output

	@printf "\n Copying sources\n";
	cd server; tar cf - --exclude='node_modules' --exclude='static' --exclude='dbs/*' * | ( cd $(BUILDPATH)/output; tar xfp -)
	cd frontend/web; tar cf - --exclude='node_modules' --exclude='dist' * | ( cd $(BUILDPATH)/frontend; tar xfp -)

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
	npm i;

	@printf "\n Relocating output\n";
	mv $(BUILDPATH)/output $(OUT);

	@printf "\n Cleaning build files\n";
	rm -rf $(BUILDPATH);

	@printf "\n Done!";

.PHONY: clean
clean:
	@echo " Cleaning...";
	rm -rf $(BUILDPATH);
	rm -rf $(OUT);

snap: build
	snapcraft snap -o $(SNAP);

cleansnap: build

docker: build
