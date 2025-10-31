NAMESPACE ?= jia

update-image:
	@echo "Updating thegifts image in namespace $(NAMESPACE)..."
	kubectl set image deployment/thegifts thegifts=jiadocker777/bold-plastic:latest -n $(NAMESPACE) --record
	kubectl rollout restart deployment/thegifts -n $(NAMESPACE)
	kubectl rollout status deployment/thegifts -n $(NAMESPACE)
	@echo "Image updated successfully..."

update-secret: 
	@echo "Updating secret in namespace $(NAMESPACE)..."
	kubectl delete secret thegifst-secret -n $(NAMESPACE) --ignore-not-found
	kubectl create secret generic thegifts-secret -n $(NAMESPACE) --from-env-file=./.env 
	@echo "Secret updated successfully..."
