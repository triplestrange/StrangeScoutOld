#!make

BUILDPATH=$(shell pwd)/build
SNAP=$(BUILDPATH)/strangescout.snap

build:
	@printf "\n Creating build directories\n";
	mkdir -p $(BUILDPATH)/{frontend,output};

	@printf "\n Copying sources\n";
	find server/ -mindepth 1 -maxdepth 1 ! -regex '\(server/node_modules\|server/frontend/dist\)' -exec cp -r {} $(BUILDPATH)/output \;
	find frontend/web/ -mindepth 1 -maxdepth 1 ! -regex '\(frontend/web/node_modules\)' -exec cp -r {} $(BUILDPATH)/frontend \;

	@printf "\n Installing frontend dependencies\n";
	@cd $(BUILDPATH)/frontend; \
	npm i;

	@printf "\n Building frontend\n";
	@cd $(BUILDPATH)/frontend; \
	./node_modules/.bin/ng build --prod --aot --source-map=false --build-optimizer --progress --output-path=$(BUILDPATH)/output/static;

	@printf "\n Installing server dependencies\n";
	@cd $(BUILDPATH)/output; \
	npm i;

	@printf "\n Done!";

.PHONY: clean
clean:
	@echo " Cleaning...";
	rm -rf $(BUILDPATH);

snap: build
	snapcraft snap -o $(SNAP);

cleansnap: build

docker: build
